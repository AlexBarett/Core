/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';

import * as i from 'core/async/interface';
import Super from 'core/async/modules/proxy';
export * from 'core/async/modules/proxy';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Wrapper for the global.setImmediate
	 *
	 * @param fn - callback function
	 * @param [opts] - additional options for the operation
	 */
	setImmediate(fn: Function, opts?: i.AsyncCbOptions<CTX>): Nullable<i.TimerId> {
		const
			// tslint:disable-next-line
			wrapper = globalThis['setImmediate'],

			// tslint:disable-next-line
			clearFn = globalThis['clearImmediate'];

		return this.registerTask({
			...opts,
			name: this.namespaces.immediate,
			obj: fn,
			clearFn,
			wrapper,
			linkByWrapper: true
		});
	}

	/**
	 * Wrapper for the global.clearImmediate
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearImmediate(id?: i.TimerId): this;

	/**
	 * Clears the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearImmediate(opts: i.ClearOptionsId<i.TimerId>): this;
	clearImmediate(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.cancelTask(task, this.namespaces.immediate);
	}

	/**
	 * Mutes the specified "setImmediate" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteImmediate(id?: i.TimerId): this;

	/**
	 * Mutes the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteImmediate(opts: i.ClearOptionsId<i.TimerId>): this;
	muteImmediate(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('muted', task, this.namespaces.immediate);
	}

	/**
	 * Unmutes the specified "setImmediate" timer
	 * @param [id] - operation id (if not defined will be get all handlers)
	 */
	unmuteImmediate(id?: i.TimerId): this;

	/**
	 * Unmutes the specified "setImmediate" timer or a group of timers
	 *
	 * @param opts - options for the operation
	 */
	unmuteImmediate(opts: i.ClearOptionsId<i.TimerId>): this;
	unmuteImmediate(p: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!muted', p, this.namespaces.immediate);
	}

	/**
	 * Suspends the specified "setImmediate" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendImmediate(id?: i.TimerId): this;

	/**
	 * Suspends the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendImmediate(opts: i.ClearOptionsId<i.TimerId>): this;
	suspendImmediate(p: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('paused', p, this.namespaces.immediate);
	}

	/**
	 * Unsuspends the specified "setImmediate" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendImmediate(id?: i.TimerId): this;

	/**
	 * Unsuspends the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendImmediate(opts: i.ClearOptionsId<i.TimerId>): this;
	unsuspendImmediate(p: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!paused', p, this.namespaces.immediate);
	}

	/**
	 * Wrapper for the global.setInterval
	 *
	 * @param fn - callback function
	 * @param timeout - timer value
	 * @param [opts] - additional options for the operation
	 */
	setInterval(fn: Function, timeout: number, opts?: i.AsyncCbOptions<CTX>): Nullable<i.TimerId> {
		return this.registerTask({
			...opts,
			name: this.namespaces.interval,
			obj: fn,
			clearFn: clearInterval,
			wrapper: setInterval,
			linkByWrapper: true,
			periodic: true,
			args: [timeout]
		});
	}

	/**
	 * Wrapper for the global.clearInterval
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearInterval(id?: i.TimerId): this;

	/**
	 * Clears the specified "setInterval" timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearInterval(opts: i.ClearOptionsId<i.TimerId>): this;
	clearInterval(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.cancelTask(task, this.namespaces.interval);
	}

	/**
	 * Mutes the specified "setInterval" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteInterval(id?: i.TimerId): this;

	/**
	 * Mutes the specified "setInterval" timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteInterval(opts: i.ClearOptionsId<i.TimerId>): this;
	muteInterval(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!muted', task, this.namespaces.interval);
	}

	/**
	 * Unmutes the specified "setInterval" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteInterval(id?: i.TimerId): this;

	/**
	 * Unmutes the specified "setInterval" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteInterval(opts: i.ClearOptionsId<i.TimerId>): this;
	unmuteInterval(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!muted', task, this.namespaces.interval);
	}

	/**
	 * Suspends the specified "setInterval" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendInterval(id?: i.TimerId): this;

	/**
	 * Suspends the specified "setInterval" timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendInterval(opts: i.ClearOptionsId<i.TimerId>): this;
	suspendInterval(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('paused', task, this.namespaces.interval);
	}

	/**
	 * Unsuspends the specified "setImmediate" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendInterval(id?: i.TimerId): this;

	/**
	 * Unsuspends the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendInterval(opts: i.ClearOptionsId<i.TimerId>): this;
	unsuspendInterval(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!paused', task, this.namespaces.interval);
	}

	/**
	 * Wrapper for the global.setTimeout
	 *
	 * @param fn - callback function
	 * @param timeout - timeout value
	 * @param [opts] - additional options for the operation
	 */
	setTimeout(fn: Function, timeout: number, opts?: i.AsyncCbOptions<CTX>): Nullable<i.TimerId> {
		return this.registerTask({
			...opts,
			name: this.namespaces.timeout,
			obj: fn,
			clearFn: clearTimeout,
			wrapper: setTimeout,
			linkByWrapper: true,
			args: [timeout]
		});
	}

	/**
	 * Wrapper for the global.clearTimeout
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearTimeout(id?: i.TimerId): this;

	/**
	 * Clears the specified "setTimeout" timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearTimeout(opts: i.ClearOptionsId<i.TimerId>): this;
	clearTimeout(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.cancelTask(task, this.namespaces.timeout);
	}

	/**
	 * Mutes the specified "setTimeout" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteTimeout(id?: i.TimerId): this;

	/**
	 * Mutes the specified "setTimeout" timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteTimeout(opts: i.ClearOptionsId<i.TimerId>): this;
	muteTimeout(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('muted', task, this.namespaces.timeout);
	}

	/**
	 * Unmutes the specified "setTimeout" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteTimeout(id?: i.TimerId): this;

	/**
	 * Unmutes the specified "setTimeout" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteTimeout(opts: i.ClearOptionsId<i.TimerId>): this;
	unmuteTimeout(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!muted', task, this.namespaces.timeout);
	}

	/**
	 * Suspends the specified "setTimeout" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendTimeout(id?: i.TimerId): this;

	/**
	 * Suspends the specified "setTimeout" timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendTimeout(opts: i.ClearOptionsId<i.TimerId>): this;
	suspendTimeout(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('paused', task, this.namespaces.timeout);
	}

	/**
	 * Unsuspends the specified "setTimeout" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendTimeout(id?: i.TimerId): this;

	/**
	 * Unsuspends the specified "setTimeout" timer or a group of names
	 * @param opts - options for the operation
	 */
	unsuspendTimeout(opts: i.ClearOptionsId<i.TimerId>): this;
	unsuspendTimeout(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!paused', task, this.namespaces.timeout);
	}

	/**
	 * Wrapper for the global.requestIdleCallback
	 *
	 * @param fn - callback function
	 * @param [opts] - additional options for the operation
	 */
	requestIdleCallback<R = unknown>(
		fn: i.IdleCb<R, CTX>,
		opts?: i.AsyncCreateIdleOptions<CTX>
	): Nullable<i.TimerId> {
		let
			wrapper,
			clearFn;

		if (typeof requestIdleCallback !== 'function') {
			wrapper = (fn) => setTimeout(() => fn({timeRemaining: () => 0}), 50);
			clearFn = clearTimeout;

		} else {
			wrapper = requestIdleCallback;
			clearFn = cancelIdleCallback;
		}

		return this.registerTask({
			...opts && Object.reject(opts, 'timeout'),
			name: this.namespaces.idleCallback,
			obj: fn,
			clearFn,
			wrapper,
			linkByWrapper: true,
			args: opts && Object.select(opts, 'timeout')
		});
	}

	/**
	 * Wrapper for the global.cancelIdleCallback
	 *
	 * @alias
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	cancelIdleCallback(id?: i.TimerId): this;

	/**
	 * Clears the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	cancelIdleCallback(opts: i.ClearOptionsId<i.TimerId>): this;
	cancelIdleCallback(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.clearIdleCallback(task);
	}

	/**
	 * Wrapper for the global.cancelIdleCallback
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearIdleCallback(id?: i.TimerId): this;

	/**
	 * Clears the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearIdleCallback(opts: i.ClearOptionsId<i.TimerId>): this;
	clearIdleCallback(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.cancelTask(task, this.namespaces.idleCallback);
	}

	/**
	 * Mutes the specified "requestIdleCallback" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteIdleCallback(id?: i.TimerId): this;

	/**
	 * Mutes the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteIdleCallback(opts: i.ClearOptionsId<i.TimerId>): this;
	muteIdleCallback(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('muted', task, this.namespaces.idleCallback);
	}

	/**
	 * Unmutes the specified "requestIdleCallback" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteIdleCallback(id?: i.TimerId): this;

	/**
	 * Unmutes the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteIdleCallback(opts: i.ClearOptionsId<i.TimerId>): this;
	unmuteIdleCallback(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!muted', task, this.namespaces.idleCallback);
	}

	/**
	 * Suspends the specified "requestIdleCallback" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendIdleCallback(id?: i.TimerId): this;

	/**
	 * Suspends the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendIdleCallback(opts: i.ClearOptionsId<i.TimerId>): this;
	suspendIdleCallback(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('paused', task, this.namespaces.idleCallback);
	}

	/**
	 * Unsuspends the specified "requestIdleCallback" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendIdleCallback(id?: i.TimerId): this;

	/**
	 * Unsuspends the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendIdleCallback(opts: i.ClearOptionsId<i.TimerId>): this;
	unsuspendIdleCallback(task?: i.TimerId | i.ClearOptionsId<i.TimerId>): this {
		return this.markTask('!paused', task, this.namespaces.idleCallback);
	}

	/**
	 * Returns a promise that will be resolved after the specified timeout
	 *
	 * @param timeout
	 * @param [opts] - additional options for the operation
	 */
	sleep(timeout: number, opts?: i.AsyncOptions): SyncPromise<void> {
		return new SyncPromise((resolve, reject) => {
			this.setTimeout(resolve, timeout, {
				...opts,
				promise: true,
				onClear: <i.AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <i.AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved on the next tick of the event loop
	 * @param [opts] - additional options for the operation
	 */
	nextTick(opts?: i.AsyncOptions): SyncPromise<void> {
		return new SyncPromise((resolve, reject) => {
			this.setImmediate(resolve, {
				...opts,
				promise: true,
				onClear: <i.AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <i.AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved on the process idle
	 * @param [opts] - additional options for the operation
	 */
	idle(opts?: i.AsyncIdleOptions): SyncPromise<IdleDeadline> {
		return new SyncPromise((resolve, reject) => {
			this.requestIdleCallback(resolve, {
				...opts,
				promise: true,
				onClear: <i.AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <i.AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved only when the specified function returns a positive value (== true)
	 *
	 * @param fn
	 * @param [opts] - additional options for the operation
	 */
	wait(fn: Function, opts?: i.AsyncWaitOptions): SyncPromise<boolean> {
		if (fn()) {
			if (opts?.label) {
				this.clearPromise(opts);
			}

			return SyncPromise.resolve(true);
		}

		return new SyncPromise((resolve, reject) => {
			let
				id;

			const cb = () => {
				if (fn()) {
					resolve(true);
					this.clearPromise(id);
				}
			};

			id = this.setInterval(cb, opts?.delay || 15, {
				...opts,
				promise: true,
				onClear: <i.AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <i.AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}
}
