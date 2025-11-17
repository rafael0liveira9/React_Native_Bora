import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserImages } from "@/service/images";

interface ImageItem {
  id: number;
  url: string;
  order: number;
}

interface ImageGalleryViewProps {
  themeColors: any;
  token: string;
  clientId: number;
}

export default function ImageGalleryView({
  themeColors,
  token,
  clientId,
}: ImageGalleryViewProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get("window").width;
  const cardWidth = (width - 60) / 3; // 3 colunas

  useEffect(() => {
    loadImages();
  }, [clientId]);

  async function loadImages() {
    setIsLoading(true);
    const res = await getUserImages({ clientId, token });

    if (res?.images) {
      setImages(res.images);
    }
    setIsLoading(false);
  }

  function openImageModal(imageUrl: string, index: number) {
    setSelectedImage(imageUrl);
    setCurrentIndex(index);
  }

  function closeModal() {
    setSelectedImage(null);
  }

  function nextImage() {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedImage(images[currentIndex + 1].url);
    }
  }

  function previousImage() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedImage(images[currentIndex - 1].url);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  if (images.length === 0) {
    return null; // Não mostrar nada se não houver imagens
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="images" size={20} color={themeColors.primary} />
          <Text style={[styles.title, { color: themeColors.text }]}>Fotos</Text>
        </View>
        <Text style={[styles.count, { color: themeColors.textSecondary }]}>
          {images.length}
        </Text>
      </View>

      {/* Grid de imagens */}
      <View style={styles.grid}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={image.id}
            onPress={() => openImageModal(image.url, index)}
            style={[
              styles.imageCard,
              {
                width: cardWidth,
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Image source={{ uri: image.url }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal de visualização em tela cheia */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Background escuro */}
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={closeModal}
          />

          {/* Botão fechar */}
          <TouchableOpacity
            onPress={closeModal}
            style={[styles.closeButton, { backgroundColor: "rgba(0,0,0,0.7)" }]}
          >
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>

          {/* Contador */}
          <View
            style={[
              styles.counterContainer,
              { backgroundColor: "rgba(0,0,0,0.7)" },
            ]}
          >
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>

          {/* Imagem */}
          <View style={styles.imageContainer}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Navegação */}
          {images.length > 1 && (
            <>
              {currentIndex > 0 && (
                <TouchableOpacity
                  onPress={previousImage}
                  style={[
                    styles.navButton,
                    styles.navButtonLeft,
                    { backgroundColor: "rgba(0,0,0,0.7)" },
                  ]}
                >
                  <Ionicons name="chevron-back" size={32} color="#FFF" />
                </TouchableOpacity>
              )}

              {currentIndex < images.length - 1 && (
                <TouchableOpacity
                  onPress={nextImage}
                  style={[
                    styles.navButton,
                    styles.navButtonRight,
                    { backgroundColor: "rgba(0,0,0,0.7)" },
                  ]}
                >
                  <Ionicons name="chevron-forward" size={32} color="#FFF" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  count: {
    fontSize: 16,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageCard: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    resizeMode: "cover",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  counterContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  counterText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
  },
  navButtonLeft: {
    left: 20,
  },
  navButtonRight: {
    right: 20,
  },
});
