
export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const cellPhoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

export const MFObjetives = [
  { label: "Hipertrofia", value: "Hipertrofia" },
  { label: "Perda de peso", value: "Perda de peso" },
  { label: "Ganho de peso", value: "Ganho de peso" },
  {
    label: "Prática de exercicíos",
    value: "Prática de exercicíos",
  },
  { label: "Saúde e bem estar", value: "Saúde e bem estar" },
  { label: "Curiosidade", value: "Curiosidade" },
]
export const MFGenders = [
                { label: "Masculino", value: "1" },
                { label: "Feminino", value: "2" },
                {
                  label: "Prefiro não identificar",
                  value: "3",
                },
]


export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}
  

export function calculateAge(dateString: string): string {
    const birthDate = new Date(dateString);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  
    if (!hasHadBirthdayThisYear) {
      age--;
    }
  
    return `${age} anos`;
}
  
  

export function getGender(gender: string | number): string {
    const x = gender.toString()

    switch (x) {
        case '1':
            return `Masculino`;
        
        case '2':
            return `Feminino`;
        
        case '3':
            return `Prefiro não informar`;
    
        default:
            return `Não definido`;
    }
  
}
  
export function getErrorText(e: string) {
    switch (e) {
      case "name":
        return "Digite um nome válido.";
      case "email":
        return "Digite um email válido.";
      case "password":
        return "A senha deve conter no mínimo 4 caracteres.";
      case "passwordConfirm":
        return "A duas senhas devem ser iguais.";
        case "document":
          return "Digite um documento válido.";
      default:
        return "Erro desconhecido.";
    }
}
  
export function cpfFormat(value: string) {
    if (value) {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
  
    const part1 = cleaned.slice(0, 3);
    const part2 = cleaned.slice(3, 6);
    const part3 = cleaned.slice(6, 9);
    const part4 = cleaned.slice(9, 11);
  
    if (cleaned.length <= 3) return part1;
    if (cleaned.length <= 6) return `${part1}.${part2}`;
    if (cleaned.length <= 9) return `${part1}.${part2}.${part3}`;
    return `${part1}.${part2}.${part3}-${part4}`;
    } else {
      return ''
  }
}

export function phoneFormat(value: string) {
  if (value) {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  const ddd = cleaned.slice(0, 2);
  const part1 = cleaned.slice(2, cleaned.length <= 10 ? 6 : 7);
  const part2 = cleaned.slice(cleaned.length <= 10 ? 6 : 7);

  if (cleaned.length === 0) return '';
  if (cleaned.length <= 2) return `(${ddd}`;
  if (cleaned.length <= (cleaned.length <= 10 ? 6 : 7)) return `(${ddd}) ${part1}`;
    return `(${ddd}) ${part1}-${part2}`;
  } else {
    return ''
}
}

export function getRepetitionsFormat(array: string[]) {

  if (array && Array.isArray(array)) {
      const allEqual = array.every((item) => item === array[0]);

    if (allEqual) {
      return array[0];
    }

    return array.join(', ');
  }

}

export function getLevel({ level }: { level: number }) {
  switch (level) {
    case 1 :
      return {name:'FÁCIL', BCcolor:'#1E9732FF', FColor: '#ffffff'}
    case 2:
      return {name:'MODERADO', BCcolor:'#B8B01FFF', FColor: '#ffffff'}
    case 3:
      return {name:'DIFICIL', BCcolor:'#B02020FF', FColor: '#ffffff'}
    case 4:
      return {name:'PROFISSIONAL', BCcolor:'#000000', FColor: '#ffffff'}
  
    default:
      break;
  }
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) {
    return "agora";
  } else if (minutes === 1) {
    return "há 1m";
  } else if (minutes < 60) {
    return `há ${minutes}m`;
  } else if (hours === 1) {
    return "há 1h";
  } else if (hours < 24) {
    return `há ${hours}h`;
  } else if (days === 1) {
    return "há 1d";
  } else if (days === 2) {
    return "há 2d";
  } else {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
}