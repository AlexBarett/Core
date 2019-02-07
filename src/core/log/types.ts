/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type LogLevel = 'info' | 'warn' | 'error';

export interface Logger {
	(context: string, logLevel: LogLevel, messageOrError: Error | string, ...details: unknown[]): void;
}

export interface ExtendedLogger extends Logger {
	/**
	 * Log message with level 'info' and specific context
	 *
	 * @param context - log record context
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	info(context: string, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'warn' and specific context
	 *
	 * @param context - log record context
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	warn(context: string, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'warn' and specific context
	 *
	 * @param context - log record context
	 * @param error - error to log
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	warn(context: string, error: Error, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'error' and specific context
	 *
	 * @param context - log record context
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	error(context: string, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'error' and specific context
	 *
	 * @param context - log record context
	 * @param error - error to log
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	error(context: string, error: Error, message: string, ...details: unknown[]): void;

	/**
	 * Return new log function with defined namespace.
	 * The namespace will precede a context of every log record of the function.
	 *
	 * @example
	 * const log2 = log.namespace('global');
	 * log2.info('res', 'hello');
	 * // prints context 'global:res'
	 *
	 * @example
	 * const log3 = log.namespace('super').namespace('global');
	 * log3.info('res', 'hello');
	 * // prints context 'super:global:res'
	 *
	 * @param ns - namespace that will precede a context of each log record
	 */
	namespace(ns: string): ExtendedLogger;
}
