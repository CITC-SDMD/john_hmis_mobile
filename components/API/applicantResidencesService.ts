import BaseAPIService from '../../components/API/BaseAPIService';

class ApplicantResidencesService extends BaseAPIService {
    async saveApplicantResidences(params: object): Promise<any> {
        return await this.request(`/applicant-residences`, "POST", params);
    }

    async deleteApplicantResidences(uuid: number): Promise<any> {
        return await this.request(`/applicant-residences/${uuid}`, "DELETE");
    }
}

export const applicantResidencesService = new ApplicantResidencesService();