import { globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format, isValid, parse } from "date-fns";
import { useRef, useState } from "react";

import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from "react-native";

interface MFDatePickerInputProps {
  label?: string;
  labelIcon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  themeColors: any;
}

interface MFSelectInputProps {
  label?: string;
  labelIcon?: React.ReactNode;
  error?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: any[];
  isDisabled?: boolean;
  themeColors?: any;
}

interface MFTextInputProps extends TextInputProps {
  isDisabled?: boolean;
  isNumeric?: boolean;
  themeColors?: any;
  fontSize?: any;
  error?: string;
  label?: string;
  labelIcon?: React.ReactNode;
  icon?: React.ReactNode;
}

interface MFSelectSortProps extends ViewProps {
  themeColors: any;
  sort: string;
  setSort: (value: string) => void;
  sortOptions: { value: string; label: string; icon?: React.ReactNode }[];
}

interface MFPasswordInputProps extends TextInputProps {
  themeColors?: any;
  error?: string;
}

interface MFDoubleProps extends TextInputProps {
  isDisabled?: boolean;
  isNumeric?: boolean;
  themeColors?: any;
  error?: string;
  label?: string;
  labelIcon?: React.ReactNode;
  icon?: React.ReactNode;
  selectedValue: string;
  onValueChange: (value: string) => void;
  selectedValue2: string;
  onValueChange2: (value: string) => void;
}

export function MFSelectInput({
  label,
  labelIcon,
  error,
  selectedValue,
  onValueChange,
  options,
  isDisabled,
  themeColors,
}: MFSelectInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          {labelIcon}
          <Text
            style={{
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 17,
            }}
          >
            {label}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.pickerWrapper,
          {
            backgroundColor: themeColors.background,
            borderColor: error ? themeColors.primary : themeColors.text,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
      >
        <Picker
          enabled={!isDisabled}
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={{
            color: error ? themeColors.primary : themeColors.text,
            width: "100%",
          }}
          dropdownIconColor={themeColors.text}
        >
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      {error && (
        <View style={styles.errorView}>
          <Text style={[styles.errorText, { color: themeColors.primary }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

export function MFTextInput({
  isDisabled,
  isNumeric,
  themeColors,
  error,
  label,
  labelIcon,
  icon,
  ...props
}: MFTextInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          {labelIcon}
          <Text
            style={{
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 17,
            }}
          >
            {label}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: themeColors.background,
            borderColor: error ? themeColors.primary : themeColors.text,
          },
        ]}
      >
        {icon && icon}
        <TextInput
          style={[
            styles.input,
            {
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 16,
              width: "100%",
            },
          ]}
          keyboardType={isNumeric ? "numeric" : "default"}
          placeholderTextColor={themeColors.textSecondary}
          {...props}
        />
      </View>
      {error && (
        <View style={styles.errorView}>
          <Text style={[styles.errorText, { color: themeColors.primary }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

export function MFLongTextInput({
  isDisabled,
  isNumeric,
  themeColors,
  error,
  label,
  labelIcon,
  ...props
}: MFTextInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          {labelIcon}
          <Text
            style={{
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 17,
            }}
          >
            {label}
          </Text>
        </View>
      )}
      <TextInput
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        keyboardType="default"
        style={[
          styles.longInput,
          {
            backgroundColor: themeColors.background,
            color: error ? themeColors.primary : themeColors.text,
            borderColor: error ? themeColors.primary : themeColors.text,
          },
        ]}
        placeholderTextColor={themeColors.textSecondary}
        {...props}
      />
      {error && (
        <View style={styles.errorView}>
          <Text style={[styles.errorText, { color: themeColors.primary }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

export function MFPasswordInput({
  themeColors,
  error,
  ...props
}: MFPasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: themeColors.background,
            borderColor: error ? themeColors.primary : themeColors.text,
          },
        ]}
      >
        <TextInput
          secureTextEntry={!visible}
          style={[
            styles.input,
            {
              color: error ? themeColors.primary : themeColors.text,
              borderColor: error ? themeColors.primary : themeColors.text,
              width: "100%",
            },
          ]}
          placeholderTextColor={themeColors.textSecondary}
          {...props}
        />
      </View>
      {error && (
        <View style={styles.errorView}>
          <Text style={[styles.errorText, { color: themeColors.primary }]}>
            {error}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.icon}
        onPress={() => setVisible((prev) => !prev)}
      >
        <Ionicons name={visible ? "eye-off" : "eye"} size={22} color="#888" />
      </TouchableOpacity>
    </View>
  );
}

export function MFDatePickerInput({
  value,
  onChange,
  label,
  labelIcon,
  error,
  themeColors,
}: MFDatePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const displayDate = value
    ? format(new Date(value), "dd/MM/yyyy")
    : "Selecione uma data";

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      // Força hora 00:00:00.000Z
      const adjustedDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );
      onChange(adjustedDate.toISOString());
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <View
          style={[
            styles.labelContainer,
            {
              backgroundColor: themeColors.background,
              borderColor: error ? themeColors.primary : themeColors.text,
            },
          ]}
        >
          {labelIcon}
          <Text
            style={{
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 17,
            }}
          >
            {label}
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.input}
      >
        <Text style={{ color: themeColors.text, fontSize: 16 }}>
          {displayDate}
        </Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorView}>
          <Text style={[styles.errorText, { color: themeColors.primary }]}>
            {error}
          </Text>
        </View>
      )}
      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "compact"}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

export function MFDateInputText2({
  value,
  onChange,
  label,
  labelIcon,
  error,
  themeColors,
}: MFDatePickerInputProps) {
  const [textValue, setTextValue] = useState(formatDisplay(value));

  function formatDisplay(isoDate: string) {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function applyMask(input: string) {
    const numbers = input.replace(/\D/g, "").slice(0, 8);
    let masked = "";
    if (numbers.length <= 2) masked = numbers;
    else if (numbers.length <= 4)
      masked = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    else
      masked = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4
      )}`;
    return masked;
  }

  function handleChange(text: string) {
    const masked = applyMask(text);
    setTextValue(masked);

    if (masked.length === 10) {
      const parsed = parse(masked, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        const adjusted = new Date(
          parsed.getFullYear(),
          parsed.getMonth(),
          parsed.getDate(),
          12,
          0,
          0
        );
        onChange(adjusted.toISOString());
      }
    }
  }

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          {labelIcon}
          <Text
            style={{
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 17,
            }}
          >
            {label}
          </Text>
        </View>
      )}
      <View style={styles.inputBox}>
        <TextInput
          value={textValue}
          onChangeText={handleChange}
          keyboardType="numeric"
          maxLength={10}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={themeColors.textSecondary}
          style={styles.input}
        />
      </View>
      {error && (
        <View style={styles.errorView}>
          <Text style={[styles.errorText, { color: themeColors.primary }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

export function MFSelectSort({
  themeColors,
  sort,
  setSort,
  sortOptions,
}: MFSelectSortProps) {
  return (
    <View style={styles.sortBox}>
      <Text style={{ fontSize: 16, paddingBottom: 10, paddingLeft: 10 }}>
        Filtrar por:{" "}
      </Text>
      {sortOptions?.map(
        (
          e: { value: string; label: string; icon?: React.ReactNode },
          y: number
        ) => {
          return (
            <TouchableOpacity
              style={[styles.sortBoxItems, { borderColor: themeColors.grey }]}
              key={y}
              onPress={() => setSort(e.value.toString())}
            >
              <View style={globalStyles.flexr}>
                {e.icon}
                <Text style={{ fontSize: 18, paddingHorizontal: 5 }}>
                  {e.label}
                </Text>
              </View>
              <View style={{ width: 15, height: 15 }}>
                {sort?.toString() === e?.value?.toString() && (
                  <AntDesign
                    name="checkcircle"
                    size={14}
                    color={themeColors.success}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
}

export function MFDoubleInput({
  isDisabled,
  isNumeric,
  themeColors,
  error,
  label,
  labelIcon,
  icon,
  selectedValue,
  onValueChange,
  selectedValue2,
  onValueChange2,
  ...props
}: MFDoubleProps) {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          {labelIcon}
          <Text
            style={{
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 17,
            }}
          >
            {label}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: themeColors.background,
            borderColor: error ? themeColors.primary : themeColors.text,
            justifyContent: "space-between",
          },
        ]}
      >
        {icon && icon}
        <TextInput
          style={[
            styles.doubleInput1,
            {
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 16,
            },
          ]}
          keyboardType={isNumeric ? "numeric" : "default"}
          placeholderTextColor={themeColors.textSecondary}
          editable={!isDisabled}
          value={selectedValue}
          onChangeText={onValueChange}
          {...props}
        />
        <Text
          style={{
            color: error ? themeColors.primary : themeColors.text,
            fontSize: 20,
          }}
        >
          X
        </Text>
        <TextInput
          style={[
            styles.doubleInput2,
            {
              color: error ? themeColors.primary : themeColors.text,
              fontSize: 16,
            },
          ]}
          keyboardType={isNumeric ? "numeric" : "default"}
          placeholderTextColor={themeColors.textSecondary}
          editable={!isDisabled}
          value={selectedValue2}
          onChangeText={onValueChange2}
          {...props}
        />
      </View>
      {error && (
        <View style={styles.errorView}>
          <Text style={[styles.errorText, { color: themeColors.primary }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

export function MFWheightInput({
  isDisabled,
  themeColors,
  label,
  fontSize,
  error,
  ...props
}: MFTextInputProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View
      style={[
        styles.inputInfoWBox,
        {
          backgroundColor: themeColors.background,
          borderColor: error ? themeColors.primary : themeColors.text,
        },
      ]}
    >
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            ref={inputRef}
            style={{
              color: error ? themeColors.primary : themeColors.text,
              fontSize: fontSize ? fontSize : 13,
            }}
            keyboardType="numeric"
            placeholderTextColor={themeColors.textSecondary}
            {...props}
          />
          <Text
            style={{
              color: themeColors.text,
              fontSize: fontSize ? fontSize - 2 : 11,
            }}
          >
            kg
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 50,
    width: "100%",
    height: 47,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 47,
    flexDirection: "row",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  inputInfoWBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 0,
    flexDirection: "row",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  input: {
    height: 47,
  },
  longInput: {
    borderWidth: 1,
    borderRadius: 27,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    minHeight: 150,
    height: "auto",
  },
  icon: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  errorView: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingTop: 3,
    marginBottom: -20,
    paddingHorizontal: 10,
    textAlign: "right",
  },
  errorText: {
    fontSize: 12,
    fontWeight: 600,
    textAlign: "right",
    paddingBottom: 7,
  },
  sortBox: {
    width: "auto",
    height: "auto",
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 7,
  },
  sortBoxItems: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "100%",
    borderWidth: 1,
  },
  doubleInput1: {
    height: 47,
    width: "15%",
    textAlign: "center",
  },
  doubleInput2: {
    height: 47,
    width: "70%",
    textAlign: "center",
  },
});
