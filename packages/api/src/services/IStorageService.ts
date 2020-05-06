export default interface IStorageService {
	deleteImg: (key: string) => Promise<void>;
	extractFileKeyFromUrl: (plainUrl?: string) => string | null;

	uploadImg: any;
}
