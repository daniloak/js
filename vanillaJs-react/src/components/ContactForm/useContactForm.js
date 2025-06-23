import { useEffect, useState, useImperativeHandle } from 'react';
import isEmailValid from '../../utils/isEmailValid';
import useErrors from '../../hooks/useErrors';
import CategoriesService from '../../services/CategoriesService';
import formatPhone from '../../utils/formatPhone';

export default function useContactForm(onSubmit, ref) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();

  const isFormValid = name && errors.length === 0;

  useImperativeHandle(
    ref,
    () => {
      return {
        setFieldValues: (contact) => {
          setName(contact.name ?? '');
          setEmail(contact.email ?? '');
          setPhone(formatPhone(contact.phone ?? ''));
          setCategoryId(contact.category.id ?? '');
        },
        resetFields: () => {
          setName('');
          setEmail('');
          setPhone('');
          setCategoryId('');
        },
      };
    },
    []
  );

  // useEffect(() => {
  //   const refObject = ref;
  //   refObject.current = {
  //     setFieldValues: (contact) => {
  //       setName(contact.name);
  //       setEmail(contact.email);
  //       setPhone(contact.phone);
  //       setCategoryId(contact.category_id);
  //     },
  //   };
  // }, [ref]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesList = await CategoriesService.listCategories();
        setCategories(categoriesList);
      } catch {
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function handleNameChange(event) {
    setName(event.target.value);

    if (!event.target.value) {
      setError({ field: 'name', message: 'Name is mandatory' });
    } else {
      removeError('name');
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);

    if (event.target.value && !isEmailValid(event.target.value)) {
      setError({ field: 'email', message: 'E-mail invalid' });
    } else {
      removeError('email');
    }
  }

  function handlePhoneChange(event) {
    setPhone(formatPhone(event.target.value));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmiting(true);

    await onSubmit({ name, email, phone, categoryId });

    setIsSubmiting(false);
  }

  return {
    name,
    email,
    phone,
    categoryId,
    categories,
    isLoadingCategories,
    isSubmiting,
    isFormValid,
    setCategoryId,
    getErrorMessageByFieldName,
    handleNameChange,
    handleEmailChange,
    handlePhoneChange,
    handleSubmit,
  };
}
