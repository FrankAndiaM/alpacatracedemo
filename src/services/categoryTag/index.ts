import apiClient from '../api';

function selectCategory() {
  return apiClient.get('/category_tags');
}

function createCategory(data: any) {
  return apiClient.post('/category_tags', data);
}

function updateCategory(categoryId: string, data: any) {
  return apiClient.put(`/category_tags/${categoryId}`, data);
}

function deleteCategory(categoryId: string) {
  return apiClient.delete(`/category_tags/${categoryId}`);
}

function primaryCategory(data: any) {
  return apiClient.patch('/category_tags/is_primary', data);
}

function getTags() {
  return apiClient.get('/tags');
}

function createTag(data: any) {
  return apiClient.post('/tags', data);
}

function updateTag(tagId: string, data: any) {
  return apiClient.put(`/tags/${tagId}`, data);
}

function deleteTag(tagId: string) {
  return apiClient.delete(`/tags/${tagId}`);
}
export {
  selectCategory,
  createCategory,
  updateCategory,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  deleteCategory,
  primaryCategory
};
