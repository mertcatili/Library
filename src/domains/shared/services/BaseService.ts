import moment from 'moment-timezone';

export class BaseService {
    protected now(timezoneOffset: number = 3): Date {
        const currentDate = new Date();
        return new Date(currentDate.getTime() + timezoneOffset * 60 * 60 * 1000);
    }
}
