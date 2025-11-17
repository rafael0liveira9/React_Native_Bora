import { View, ViewProps } from "react-native";

interface Props extends ViewProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function MFSeparator({ width, height, color }: Props) {
  return (
    <View
      style={{ width: width, height: height, backgroundColor: color }}
    ></View>
  );
}
