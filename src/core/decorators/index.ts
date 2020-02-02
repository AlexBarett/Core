/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/decorators/README.md]]
 * @packageDocumentation
 */

import * as tools from 'core/functools';

/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export const once = tools.deprecate(
	{
		movedTo: 'core/functools'
	},

	function once(target: Object, key: string | symbol, descriptor: PropertyDescriptor): void {
		return tools.once.apply(this, arguments);
	}
);

/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export const debounce = tools.deprecate(
	{
		movedTo: 'core/functools'
	},

	function debounce(delay?: number): MethodDecorator {
		return tools.debounce.apply(this, arguments);
	}
);

/**
 * @deprecated
 * @see core/functools
 * @decorator
 */
export const throttle = tools.deprecate(
	{
		movedTo: 'core/functools'
	},

	function throttle(delay?: number): MethodDecorator {
		return tools.throttle.apply(this, arguments);
	}
);
