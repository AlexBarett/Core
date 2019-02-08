/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { getStyle } from 'core/log/engines/styles';
import { LogLevel } from 'core/log/types';

const
	styleCache = {};

/**
 * Returns string representing style for specific logLevel
 * @param [logLevel] - level of log which need style
 */
function getStringifiedStyle(logLevel?: LogLevel): string {
	if (!logLevel) {
		return '';
	}

	if (styleCache[logLevel] === undefined) {
		const stringifiedStyle = $C(getStyle(logLevel)).to('')
			.reduce((res, value, key) => res + `${key.dasherize()}:${value};`);

		if (!stringifiedStyle) {
			return '';
		}

		styleCache[logLevel] = stringifiedStyle;
	}

	return styleCache[logLevel];
}

/**
 * Prints the specified parameters to a console
 *
 * @param context - logging context
 * @param [logLevel] - level of a current logging record
 * @param [details] - additional details
 */
export function log(context: string, logLevel?: LogLevel, ...details: unknown[]): void {
	const
		style = getStringifiedStyle(logLevel);

	console.log(`%c${context}`, style, ...details);
}
