/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import Then from 'core/then';

import { IS_NODE } from 'core/const/links';
import { convertIfDate } from 'core/json';
import { normalizeHeaderName } from 'core/request/utils';
import { defaultResponseOpts } from 'core/request/const';
import { ResponseOptions, ResponseHeaders, ResponseTypes, ResponseType, Decoder } from 'core/request/interface';

export type json =
	string |
	number |
	boolean |
	null |
	any[] |
	Dictionary;

export default class Response {
	/**
	 * Response type
	 */
	type: ResponseTypes | 'object';

	/**
	 * Response status code
	 */
	readonly status: number;

	/**
	 * Range of success status codes
	 */
	readonly successStatuses: sugarjs.Range = Number.range(200, 299);

	/**
	 * True if .successStatuses contains .status
	 */
	readonly success: boolean;

	/**
	 * Response headers
	 */
	readonly headers: ResponseHeaders;

	/**
	 * Response decoders
	 */
	readonly decoders: Decoder[];

	/**
	 * Response body
	 */
	protected readonly body: ResponseType;

	/**
	 * Object factory
	 */
	protected objFactory?: Function | null;

	/**
	 * Object factory timer
	 */
	protected factoryTimer?: number;

	/**
	 * @param [body]
	 * @param [params]
	 */
	constructor(body?: ResponseType, params?: ResponseOptions) {
		const p = <typeof defaultResponseOpts & ResponseOptions>{
			...defaultResponseOpts,
			...params
		};

		this.status = p.status;
		this.success = this.successStatuses.contains(this.status);
		this.headers = this.parseHeaders(p.headers);
		this.type = p.type;
		this.decoders = (<Decoder[]>[]).concat(p.decoder || []);

		// tslint:disable-next-line
		if (this.type === 'json' && body && typeof body === 'object') {
			this.body = JSON.stringify(body);

		} else {
			this.body = body;
		}
	}

	/**
	 * Returns HTTP header by the specified name from the response
	 * @param name
	 */
	getHeader(name: string): string | undefined {
		return this.headers[normalizeHeaderName(name)];
	}

	/**
	 * Parses .body as .type and returns the result
	 */
	response<T = string | json | ArrayBuffer | Blob | Document | null | any>(): Then<T> {
		let data;
		switch (this.type) {
			case 'json':
				data = this.json();
				break;

			case 'arrayBuffer':
				data = this.arrayBuffer();
				break;

			case 'blob':
				data = this.blob();
				break;

			case 'document':
				data = this.document();
				break;

			default:
				data = this.text();
		}

		return data
			.then((obj) => $C(this.decoders).reduce((res, d) => d.call(this, res), obj))
			.then((res) => {
				if (res && typeof res === 'object' && {object: true, json: true}[this.type]) {
					res.valueOf = () => $C.clone(res);
					Object.freeze(res);
				}

				return res;
			});
	}

	/**
	 * Parses .body as Document and returns the result
	 */
	document(): Then<Document | null> {
		if (this.type !== 'document') {
			throw new TypeError('Invalid data type');
		}

		const
			body = <any>this.body;

		if (!body) {
			return <any>Then.resolve(null);
		}

		return Then.resolve(body);
	}

	/**
	 * Parses .body as JSON and returns the result
	 */
	json<T = json>(): Then<T | null> {
		if (this.type !== 'json') {
			throw new TypeError('Invalid data type');
		}

		const
			body = <any>this.body;

		if (!body) {
			return <any>Then.resolve(null);
		}

		if (Object.isString(body)) {
			return Then.immediate(() => JSON.parse(body, convertIfDate));
		}

		return Then.resolve(body);
	}

	/**
	 * Parses .body as ArrayBuffer and returns the result
	 */
	arrayBuffer(): Then<ArrayBuffer | null> {
		if (this.type !== 'arrayBuffer') {
			throw new TypeError('Invalid data type');
		}

		const
			body = <any>this.body;

		if (!body) {
			return <any>Then.resolve(null);
		}

		return Then.resolve(body.slice());
	}

	/**
	 * Parses .body as Blob and returns the result
	 */
	blob(): Then<Blob> {
		if (this.type !== 'blob') {
			throw new TypeError('Invalid data type');
		}

		return Then.resolve(new Blob([this.body], {type: this.getHeader('content-type')}));
	}

	/**
	 * Parses .body as string and returns the result
	 */
	text(): Then<string | null> {
		const
			{body, type} = this;

		if (!body) {
			return <any>Then.resolve(null);
		}

		if ({text: true, document: true}[type]) {
			return <any>Then.resolve(String(body));
		}

		if ({json: true, object: true}[type]) {
			if (Object.isString(body)) {
				return <any>Then.resolve(body);
			}

			return <any>Then.resolve(JSON.stringify(body));
		}

		const
			contentType = this.getHeader('content-type');

		let
			encoding = 'utf-8';

		if (contentType) {
			const
				search = /charset=(\S+)/.exec(contentType);

			if (search) {
				encoding = search[1].toLowerCase();
			}
		}

		if (IS_NODE) {
			// @ts-ignore
			return Buffer.from(body).toString(encoding);
		}

		if (typeof TextDecoder !== 'undefined') {
			const decoder = new TextDecoder(encoding, {fatal: true});
			return <any>Then.resolve(decoder.decode(new DataView(<any>body)));
		}

		return new Then((resolve, reject, onAbort) => {
			const
				reader = new FileReader();

			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;

			this.blob().then((blob) => {
				reader.readAsText(blob, encoding);
				onAbort(() => reader.abort());
			});
		});
	}

	/**
	 * Returns normalized object of HTTP headers by the specified string/object
	 * @param headers
	 */
	protected parseHeaders(headers: string | Dictionary<string>): ResponseHeaders {
		const
			res = {};

		if (Object.isString(headers)) {
			$C(headers.split(/[\r\n]+/)).forEach((header: string) => {
				if (!header) {
					return;
				}

				const [name, value] = header.split(':', 2);
				res[normalizeHeaderName(name)] = value.trim();
			});

		} else {
			$C(headers).reduce((value, name) => {
				if (!value) {
					return;
				}

				res[normalizeHeaderName(name)] = value.trim();
			});
		}

		return Object.freeze(res);
	}
}
