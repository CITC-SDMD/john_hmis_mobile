import BaseAPIService from '../../components/API/BaseAPIService';

class ApplicantSchedulesService extends BaseAPIService {
    async saveApplicantSchedules(uuid: any, params: object): Promise<any> {
        return await this.request(`/applicant-schedules/${uuid}`, "PUT", params);
    }

    async getApplicantSchedulesByUuid(uuid: string): Promise<any> {
        return await this.request(`/applicant-schedules/${uuid}`, "GET");
    }

    async updateApplicantSchedules(uuid: any, params: object): Promise<any> {
        return await this.request(`/applicant-schedules/${uuid}`, "PUT", params);
    }

    async deleteApplicantSchedules(uuid: number): Promise<any> {
        return await this.request(`/applicant-schedules/${uuid}`, "DELETE");
    }

    async cancelApplicantSchedules(uuid: any, ): Promise<any> {
        return await this.request(`/applicant-schedules/${uuid}/cancel`, "PUT");
    }
}

export const applicantSchedulesService = new ApplicantSchedulesService();