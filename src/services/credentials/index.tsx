import apiClient from '../apiSuite';

function listCredentialsFromFarmer(farmerId: string) {
  return apiClient.get(
    `/credentials/agro_partners/credentials/producers/issued_credential?model_id=${farmerId}&model_type=Farmers`
  );
}

function listCredentialsFromClothes(clotheId: string) {
  return apiClient.get(
    `/credentials/agro_partners/credentials/producers/issued_credential?model_id=${clotheId}&model_type=Clothes`
  );
}

function listIssuedCredentials(modelId: string, modelType: string) {
  return apiClient.get(
    `/credentials/agro_partners/credentials/producers/issued_credential?model_id=${modelId}&model_type=${modelType}`
  );
}

export { listCredentialsFromFarmer, listCredentialsFromClothes, listIssuedCredentials };
