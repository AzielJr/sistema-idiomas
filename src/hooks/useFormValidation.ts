import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = validationRules[name];
    if (!rule) return null;

    // Validação required
    if (rule.required && (!value || value.toString().trim() === '')) {
      return 'Este campo é obrigatório';
    }

    // Validação minLength
    if (rule.minLength && value && value.toString().length < rule.minLength) {
      return `Mínimo de ${rule.minLength} caracteres`;
    }

    // Validação maxLength
    if (rule.maxLength && value && value.toString().length > rule.maxLength) {
      return `Máximo de ${rule.maxLength} caracteres`;
    }

    // Validação pattern
    if (rule.pattern && value && !rule.pattern.test(value.toString())) {
      return 'Formato inválido';
    }

    // Validação customizada
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validação em tempo real se o campo foi tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
  };
};

// Regras de validação comuns
export const commonValidationRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Email inválido';
      }
      return null;
    }
  },
  phone: {
    pattern: /^[\d\s\-\(\)\+]+$/,
    custom: (value: string) => {
      if (value && !/^[\d\s\-\(\)\+]+$/.test(value)) {
        return 'Telefone inválido';
      }
      return null;
    }
  },
  cpf: {
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    custom: (value: string) => {
      if (value && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) {
        return 'CPF inválido (formato: 000.000.000-00)';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value && value.length < 6) {
        return 'Senha deve ter pelo menos 6 caracteres';
      }
      return null;
    }
  }
};
