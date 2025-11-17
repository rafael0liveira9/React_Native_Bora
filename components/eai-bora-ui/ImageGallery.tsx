import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { sendToS3 } from "@/service/s3";
import {
  getMyImages,
  addImage,
  deleteImage,
  reorderImages,
} from "@/service/images";
import Toast from "react-native-toast-message";

interface ImageItem {
  id: number;
  url: string;
  order: number;
}

interface ImageGalleryProps {
  themeColors: any;
  token: string;
}

export default function ImageGallery({ themeColors, token }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const width = Dimensions.get("window").width;
  const cardWidth = (width - 60) / 2; // 2 colunas com margens

  function getMimeType(uri: string): string {
    const extension = uri.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      default:
        return "image/jpeg";
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    setIsLoading(true);
    const res = await getMyImages({ token });

    if (res?.images) {
      setImages(res.images);
    } else {
      Toast.show({
        type: "error",
        text1: "❌ Erro ao carregar imagens",
      });
    }
    setIsLoading(false);
  }

  async function handleAddImage() {
    try {
      // Solicitar permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de permissão para acessar suas fotos."
        );
        return;
      }

      // Abrir galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);

        // Preparar arquivo para upload
        const selectedAsset = result.assets[0];
        const name = selectedAsset.uri.split("/").pop() || "gallery-image.jpg";
        const type = getMimeType(selectedAsset.uri) || "image/jpeg";

        const file = {
          uri: selectedAsset.uri,
          name: name,
          type: type,
        } as any;

        // Upload para S3
        const response = await sendToS3(file, "gallery", token);

        if (response?.url) {
          // Salvar no banco
          const res = await addImage({ url: response.url, token });

          if (res?.image) {
            Toast.show({
              type: "success",
              text1: "✅ Imagem adicionada!",
            });
            loadImages();
          } else {
            Toast.show({
              type: "error",
              text1: "❌ Erro ao salvar imagem",
            });
          }
        } else {
          Toast.show({
            type: "error",
            text1: "❌ Erro no upload",
            text2: response?.message || "Não foi possível enviar a imagem",
          });
        }
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      setIsUploading(false);
      Toast.show({
        type: "error",
        text1: "❌ Erro ao adicionar imagem",
      });
    }
  }

  async function handleDeleteImage(imageId: number) {
    Alert.alert(
      "Remover imagem",
      "Tem certeza que deseja remover esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const res = await deleteImage({ imageId, token });

            if (res?.message) {
              Toast.show({
                type: "success",
                text1: "✅ Imagem removida!",
              });
              loadImages();
            } else {
              Toast.show({
                type: "error",
                text1: "❌ Erro ao remover imagem",
              });
            }
          },
        },
      ]
    );
  }

  async function handleDragEnd(data: ImageItem[]) {
    setImages(data);

    // Atualizar ordem no backend
    const updatedImages = data.map((img, index) => ({
      id: img.id,
      order: index,
    }));

    const res = await reorderImages({ images: updatedImages, token });

    if (!res?.message) {
      Toast.show({
        type: "error",
        text1: "❌ Erro ao reordenar imagens",
      });
      loadImages(); // Recarregar em caso de erro
    }
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ImageItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.imageCard,
            {
              width: cardWidth,
              backgroundColor: themeColors.cardBackground,
              borderColor: isActive ? themeColors.primary : themeColors.border,
            },
          ]}
        >
          <Image source={{ uri: item.url }} style={styles.image} />

          {/* Botão de arrastar */}
          <View
            style={[
              styles.dragHandle,
              { backgroundColor: "rgba(0,0,0,0.6)" },
            ]}
          >
            <Ionicons name="menu" size={20} color="#FFF" />
          </View>

          {/* Botão de deletar */}
          <TouchableOpacity
            onPress={() => handleDeleteImage(item.id)}
            style={[
              styles.deleteButton,
              { backgroundColor: themeColors.error },
            ]}
          >
            <Ionicons name="trash" size={16} color="#FFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Galeria de Fotos
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {images.length} {images.length === 1 ? "foto" : "fotos"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleAddImage}
          disabled={isUploading}
          style={[
            styles.addButton,
            { backgroundColor: themeColors.primary },
          ]}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="add" size={24} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Dica de uso */}
      {images.length > 1 && (
        <View
          style={[
            styles.tipContainer,
            { backgroundColor: themeColors.cardBackground },
          ]}
        >
          <Ionicons
            name="information-circle"
            size={16}
            color={themeColors.primary}
          />
          <Text style={[styles.tipText, { color: themeColors.textSecondary }]}>
            Mantenha pressionado para reordenar
          </Text>
        </View>
      )}

      {/* Galeria */}
      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="images-outline"
            size={64}
            color={themeColors.textSecondary}
          />
          <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
            Nenhuma foto ainda
          </Text>
          <Text
            style={[styles.emptySubtext, { color: themeColors.textSecondary }]}
          >
            Toque no + para adicionar sua primeira foto
          </Text>
        </View>
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <DraggableFlatList
            data={images}
            onDragEnd={({ data }) => handleDragEnd(data)}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.galleryContent}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
          />
        </GestureHandlerRootView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  tipText: {
    fontSize: 13,
  },
  galleryContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageCard: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    resizeMode: "cover",
  },
  dragHandle: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
