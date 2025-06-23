class ContactMapper {
  toPersistent(domainContact) {
    return {
      id: domainContact.id,
      name: domainContact.name,
      email: domainContact.email,
      phone: domainContact.phone,
      category_id: domainContact.categoryId,
    };
  }

  toDomain(persistedContact) {
    return {
      id: persistedContact.id,
      name: persistedContact.name,
      email: persistedContact.email,
      phone: persistedContact.phone,
      category: {
        id: persistedContact.category_id,
        name: persistedContact.category_name,
      },
    };
  }
}

export default new ContactMapper();
