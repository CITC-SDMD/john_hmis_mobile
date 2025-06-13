import BaseAPIService from '../../components/API/BaseAPIService';

class ApplicantHouseholdMemberService extends BaseAPIService {
    async saveApplicantHousehold(params: object): Promise<any> {
        return await this.request(`/applicant-household-members`, "POST", params);
    }

    async getApplicantHouseholdByUuid(uuid: number): Promise<any> {
        return await this.request(`/applicant-household-members/${uuid}`, "GET");
    }

    async updateApplicantHousehold(uuid: any, params: object): Promise<any> {
        return await this.request(`/applicant-household-members/${uuid}`, "PUT", params);
    }
}

export const applicantHouseholdMemberService = new ApplicantHouseholdMemberService();