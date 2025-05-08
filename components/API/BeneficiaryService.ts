import BaseApiService from "./BaseAPIService";

class BeneficiaryService extends BaseApiService {
    async getBeneficiaries(params: object): Promise<any> {
        return await this.request(`/beneficiaries`, "GET", params);
    }

    async getBeneficiaryByUuId(uuid: any): Promise<any> {
        return await this.request(`/beneficiaries/${uuid}`, "GET");
    }

    async saveBeneficiary(params: object): Promise<any> {
        return await this.request(`/beneficiaries`, "POST", params);
    }

    async updateBeneficiary(uuid: object, params: object): Promise<any> {
        return await this.request(`/beneficiaries/${uuid}`, "PUT", params);
    }

    async getCountBeneficiaries(): Promise<any> {
        return await this.request(`/beneficiaries/all/count`, "GET");
    }
    
    async updateLinkApplicant(beneficiaryUuid: string, params: object): Promise<any> {
        return await this.request(`/beneficiaries/${beneficiaryUuid}/link-applicant`, "PUT", params);
    }
}

export const beneficiaryService = new BeneficiaryService();