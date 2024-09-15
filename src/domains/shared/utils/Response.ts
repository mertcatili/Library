/* eslint-disable max-classes-per-file */
export class Result<T> {
	public data: T;

	public status: boolean = true;

	public message: string = "";

	constructor(success: boolean, data: T, message: string) {
		this.data = data;
		this.message = message;
		this.status = success;
	}
}

export class SuccessResult extends Result<any> {
	constructor(data: any = { status: true }) {
		super(true, data, "SUCCESS");
	}
}

export class ErrorResult extends Result<any> {
	constructor(message: string) {
		super(false, {}, message);
	}
}

export class ErrorResponseObject extends Result<any> {
	constructor(message: string, data: any = null) {
		super(false, data, message);
	}
}
