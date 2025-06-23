class CategoryMapper {
  toPersistent(domainCategory) {
    return {
      id: domainCategory.id,
      name: domainCategory.name,
    };
  }

  toDomain(persistedCategory) {
    return {
      id: persistedCategory.id,
      name: persistedCategory.name,
    };
  }
}

export default new CategoryMapper();
