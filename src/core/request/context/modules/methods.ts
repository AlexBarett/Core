/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecated } from 'core/functools';
import { concatUrls, toQueryString } from 'core/url';

import { normalizeHeaders, applyQueryForStr, getStorageKey, getRequestKey } from 'core/request/utils';
import { storage, globalOpts } from 'core/request/const';
import { queryTplRgxp, resolveURLRgxp } from 'core/request/context/const';
import { RequestAPI } from 'core/request/interface';

import Super from 'core/request/context/modules/params';

export default class RequestContext<D = unknown> extends Super<D> {
	/**
	 * Generates a string cache key for specified url and returns it
	 * @param url
	 */
	getRequestKey(url: string): string {
		const p = this.params;
		return [getRequestKey(url, this.params), p.cacheStrategy, p.cacheId ?? ''].join();
	}

	/**
	 * Returns an absolute URL for the request API
	 * @param [apiURL] - base API URL
	 */
	resolveAPI(apiURL: Nullable<string> = globalOpts.api): string {
		const
			compute = (v) => Object.isFunction(v) ? v() : v,
			api = <{[K in keyof RequestAPI]: Nullable<string>}>({...this.params.api});

		for (let keys = Object.keys(api), i = 0; i < keys.length; i++) {
			const key = keys[i];
			api[key] = compute(api[key]);
		}

		if (api.url != null) {
			return api.url;
		}

		const resolve = (name, def?) => {
			const
				val = String((api[name] != null ? api[name] : def) ?? '');

			switch (name) {
				case 'auth':
					return val !== '' ? `${val}@` : '';

				case 'port':
					return val !== '' ? `:${val}` : '';

				case 'protocol':
					return val !== '' ? `${val.replace(/:\/+$/, '')}://` : '';

				default:
					return val;
			}
		};

		const resolveDomains = ({def = [], slice = 0, join = true} = {}) => {
			const
				list = Array.from({length: 6}, (el, i) => i + 1).slice(slice).reverse(),
				url = <string[]>[];

			for (let i = 0; i < list.length; i++) {
				const
					lvl = list[i];

				let
					domain = (lvl === 1 ? api.zone : api[`domain${lvl}`]);

				if (domain == null) {
					domain = def[lvl - 1];

				} else if (domain === '') {
					domain = undefined;
				}

				if (domain != null) {
					url.push(domain);
				}
			}

			return join !== false ? url.join('.') : url;
		};

		if (apiURL == null) {
			const
				nm = api.namespace ?? '';

			if (api.protocol == null) {
				return nm.startsWith('/') ? nm : `/${nm}`;
			}

			return concatUrls(
				resolve('protocol') +
				resolve('auth') +
				resolveDomains().toString() +
				resolve('port'),

				nm
			);
		}

		if (!RegExp.test(resolveURLRgxp, apiURL)) {
			return concatUrls(...resolveDomains({slice: 2, join: false}), resolve('namespace'));
		}

		return apiURL.replace(resolveURLRgxp, (str, protocol, auth, domains, port, nm) => {
			domains = domains?.split('.').reverse();
			nm = resolve('namespace', nm);

			if (protocol == null) {
				return concatUrls(...resolveDomains({slice: 2, join: false}), nm);
			}

			return concatUrls(
				resolve('protocol', protocol) +
				resolve('auth', auth) +
				resolveDomains({def: domains}).toString() +
				resolve('port', port),

				nm
			);
		});
	}

	/**
	 * Resolves request parameters and returns an absolute URL for the request
	 * @param [url] - base request URL
	 */
	resolveRequest(url?: Nullable<string>): string {
		if (url == null) {
			url = '';

		} else {
			const
				p = this.params,
				q = this.query;

			let
				data;

			if (this.withoutBody) {
				data = q;

			} else {
				data = Object.isPlainObject(p.body) ? p.body : q;
			}

			if (Object.isPlainObject(data)) {
				p.headers = normalizeHeaders(p.headers, data);
				url = applyQueryForStr(url, data, queryTplRgxp);

			} else {
				p.headers = normalizeHeaders(p.headers);
			}

			if (Object.size(q) > 0) {
				url = `${url}?${toQueryString(q)}`;
			}

			if (this.canCache) {
				this.cacheKey = this.getRequestKey(url);
			}
		}

		return this.params.url = url;
	}

	/**
	 * Returns an absolute URL for the request
	 *
	 * @see [[RequestContext.resolveRequest]]
	 * @param [url] - base request URL
	 */
	@deprecated({renamedTo: 'resolveRequest'})
	resolveURL(url?: Nullable<string>): string {
		return this.resolveRequest(url);
	}

	/**
	 * Drops a value of the request from the cache
	 */
	dropCache(): void {
		const
			key = this.cacheKey;

		if (key != null) {
			this.cache.remove(key);

			if (this.params.offlineCache && storage) {
				storage.then((storage) => storage.remove(getStorageKey(key))).catch(stderr);
			}
		}
	}
}
