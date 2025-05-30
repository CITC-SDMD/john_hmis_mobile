
import BaseAPIService from '../../components/API/BaseAPIService';

class BarangayService extends BaseAPIService {
    async getBarangays(): Promise<any> {
        return await this.request(`/barangays`, "GET",);
    }

    async getBarangay(id: number): Promise<any> {
        return await this.request(`/barangays/${id}`, "GET");
    }
}

export const barangayService = new BarangayService(); 
