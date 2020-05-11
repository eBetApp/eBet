
// ENTITIES
interface IBet {
	uuid: string
	name: string
}

// EXTENDED EXPRESS TYPES
declare namespace Express {
	namespace Multer {
		export interface File {
			location: string;
		}
	}
}
