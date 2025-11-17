import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  themeColors: any;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
  themeColors,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: themeColors.default,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface PostSkeletonProps {
  themeColors: any;
}

export function PostSkeleton({ themeColors }: PostSkeletonProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.secondary,
          borderColor: themeColors.text + "10",
        },
      ]}
    >
      {/* Header do Post */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {/* Avatar */}
          <Skeleton
            width={50}
            height={50}
            borderRadius={25}
            themeColors={themeColors}
          />
          <View style={{ flex: 1, marginLeft: 12, gap: 6 }}>
            {/* Nome */}
            <Skeleton
              width="60%"
              height={16}
              borderRadius={4}
              themeColors={themeColors}
            />
            {/* Data */}
            <Skeleton
              width="40%"
              height={12}
              borderRadius={4}
              themeColors={themeColors}
            />
          </View>
        </View>
      </View>

      {/* Título do Post */}
      <View style={styles.content}>
        <Skeleton
          width="80%"
          height={20}
          borderRadius={4}
          themeColors={themeColors}
          style={{ marginBottom: 8 }}
        />

        {/* Descrição */}
        <Skeleton
          width="100%"
          height={14}
          borderRadius={4}
          themeColors={themeColors}
          style={{ marginBottom: 4 }}
        />
        <Skeleton
          width="90%"
          height={14}
          borderRadius={4}
          themeColors={themeColors}
          style={{ marginBottom: 4 }}
        />
        <Skeleton
          width="70%"
          height={14}
          borderRadius={4}
          themeColors={themeColors}
        />
      </View>

      {/* Imagem (opcional - 50% de chance) */}
      {Math.random() > 0.5 && (
        <View style={styles.imageContainer}>
          <Skeleton
            width="100%"
            height={200}
            borderRadius={12}
            themeColors={themeColors}
          />
        </View>
      )}

      {/* Footer com ações */}
      <View style={styles.footer}>
        <Skeleton
          width={60}
          height={24}
          borderRadius={12}
          themeColors={themeColors}
        />
        <Skeleton
          width={60}
          height={24}
          borderRadius={12}
          themeColors={themeColors}
        />
        <Skeleton
          width={60}
          height={24}
          borderRadius={12}
          themeColors={themeColors}
        />
      </View>
    </View>
  );
}

interface TrainingSkeletonProps {
  themeColors: any;
}

export function TrainingSkeleton({ themeColors }: TrainingSkeletonProps) {
  return (
    <View
      style={[
        styles.trainingContainer,
        {
          backgroundColor: themeColors.secondary,
          borderColor: themeColors.text + "10",
        },
      ]}
    >
      {/* Imagem do treino */}
      <Skeleton
        width="100%"
        height={120}
        borderRadius={12}
        themeColors={themeColors}
        style={{ marginBottom: 12 }}
      />

      {/* Título */}
      <Skeleton
        width="70%"
        height={20}
        borderRadius={4}
        themeColors={themeColors}
        style={{ marginBottom: 8 }}
      />

      {/* Descrição */}
      <Skeleton
        width="90%"
        height={14}
        borderRadius={4}
        themeColors={themeColors}
        style={{ marginBottom: 4 }}
      />
      <Skeleton
        width="60%"
        height={14}
        borderRadius={4}
        themeColors={themeColors}
        style={{ marginBottom: 12 }}
      />

      {/* Stats */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Skeleton
          width={80}
          height={16}
          borderRadius={4}
          themeColors={themeColors}
        />
        <Skeleton
          width={80}
          height={16}
          borderRadius={4}
          themeColors={themeColors}
        />
      </View>
    </View>
  );
}

interface ClientSkeletonProps {
  themeColors: any;
}

export function ClientSkeleton({ themeColors }: ClientSkeletonProps) {
  return (
    <View
      style={[
        styles.clientContainer,
        {
          backgroundColor: themeColors.secondary,
          borderColor: themeColors.text + "10",
        },
      ]}
    >
      {/* Avatar e Info do usuário centralizados */}
      <View style={styles.clientHeader}>
        {/* Avatar circular */}
        <Skeleton
          width={60}
          height={60}
          borderRadius={30}
          themeColors={themeColors}
          style={{ marginBottom: 12 }}
        />

        {/* Nome/Nick */}
        <Skeleton
          width="50%"
          height={18}
          borderRadius={4}
          themeColors={themeColors}
          style={{ marginBottom: 8 }}
        />

        {/* Badge (opcional - 50% de chance) */}
        {Math.random() > 0.5 && (
          <Skeleton
            width={80}
            height={24}
            borderRadius={5}
            themeColors={themeColors}
          />
        )}
      </View>
    </View>
  );
}

interface ProductSkeletonProps {
  themeColors: any;
}

export function ProductSkeleton({ themeColors }: ProductSkeletonProps) {
  return (
    <View
      style={[
        styles.productContainer,
        {
          backgroundColor: themeColors.secondary,
          borderColor: themeColors.text + "10",
        },
      ]}
    >
      {/* Imagem do produto */}
      <Skeleton
        width="100%"
        height={140}
        borderRadius={0}
        themeColors={themeColors}
      />

      {/* Info do produto */}
      <View style={{ padding: 12 }}>
        {/* Título */}
        <Skeleton
          width="85%"
          height={16}
          borderRadius={4}
          themeColors={themeColors}
          style={{ marginBottom: 10 }}
        />

        {/* Criado por */}
        <Skeleton
          width="60%"
          height={12}
          borderRadius={4}
          themeColors={themeColors}
          style={{ marginBottom: 8 }}
        />
      </View>

      {/* Badges no topo direito */}
      <View
        style={{
          position: "absolute",
          top: 7,
          right: 7,
          flexDirection: "row",
          gap: 6,
        }}
      >
        <Skeleton
          width={45}
          height={24}
          borderRadius={12}
          themeColors={themeColors}
        />
        <Skeleton
          width={60}
          height={24}
          borderRadius={12}
          themeColors={themeColors}
        />
      </View>

      {/* Preço no canto inferior direito */}
      <View style={{ position: "absolute", bottom: 10, right: 12 }}>
        <Skeleton
          width={70}
          height={22}
          borderRadius={4}
          themeColors={themeColors}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginBottom: 12,
  },
  imageContainer: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  trainingContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  clientContainer: {
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  clientHeader: {
    alignItems: "center",
    justifyContent: "center",
  },
  productContainer: {
    width: "48%",
    height: 260,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
});
