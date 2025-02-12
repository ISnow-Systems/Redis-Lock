import * as Redis from "ioredis";

const DEFAULT_TIMEOUT: number = 5000;
const DEFAULT_RETRY_DELAY: number = 100;

async function acquireLock(client: Redis.Redis, lockName: string, timeout: number, retryDelay: number, onLockAcquired: (lockTimeoutValue: number) => void): Promise<void> {
	function retry(): void {
		setTimeout(() => {
			acquireLock(client, lockName, timeout, retryDelay, onLockAcquired);
		}, retryDelay);
	}

	const lockTimeoutValue: number = Date.now() + timeout + 1;
	client.set(lockName, lockTimeoutValue, "PX", timeout, "NX").then(result => {
		if (result === "OK") {
			onLockAcquired(lockTimeoutValue);
		} else {
			retry();
		}
	}).catch(retry);
}

export default function redisLock(client: Redis.Redis, retryDelay: number = DEFAULT_RETRY_DELAY): (lockName: string, timeout?: number) => Promise<() => Promise<number | null>> {

	async function lock(lockName: string, timeout: number = DEFAULT_TIMEOUT): Promise<() => Promise<number | null>> {
		return new Promise(resolve => {
			if (!lockName) {
				throw new Error("You must specify a lock string. It is on the redis key `lock.[string]` that the lock is acquired.");
			}

			lockName = `lock.${lockName}`;

			acquireLock(
				client, lockName,
				timeout, retryDelay,
				lockTimeoutValue => {
					resolve(async () => {
						if (lockTimeoutValue > Date.now()) {
							return client.del(lockName);
						} else {
							return null;
						}
					});
				});
		});
	}

	return lock;
}

