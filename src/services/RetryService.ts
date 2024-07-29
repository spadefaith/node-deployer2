/* eslint-disable */

export default class RetryService {
	retries: number;
	intervals: number[];
	desc: string;
	delay?: number;
	progress: number;
	intervalIndex: number;
	timer: any;
	stop: boolean;
	constructor(retries: number, intervals: number[], desc: string, delay: number) {
		this.retries = retries;
		this.intervals = intervals;
		this.desc = desc;
		this.delay = delay;
		this.progress = 0;
		this.intervalIndex = 0;
		this.stop = false;
	}
	async abort() {
		clearTimeout(this.timer);
		this.stop = true;
	}
	async process(asyncFunction: () => any) {
		let $this = this;
		function recurse(asyncFunction: () => any) {
			if ($this.stop) {
				return;
			}
			return asyncFunction()
				.then((r: any) => {
					return r;
				})
				.catch((err: any) => {
					$this.progress += 1;

					console.error({
						fails: $this.progress,
						description: $this.desc,
						error: err.message
					});
					if ($this.retries > $this.progress) {
						if (!!$this.intervals) {
							return new Promise((res, rej) => {
								$this.timer = setTimeout(() => {
									$this.intervalIndex += 1;
									if ($this.intervalIndex > $this.intervals.length - 1) {
										$this.intervalIndex = 0;
									}
									recurse(asyncFunction)
										.then((d: any) => {
											res(d);
										})
										.catch((err: Error) => {
											rej(err);
										});
								}, $this.intervals[$this.intervalIndex]);
							});
						} else {
							return recurse(asyncFunction);
						}
					} else {
						if ($this.desc) {
							console.error(`${$this.desc} failed. - ${err.message}`);
						}
						throw err;
					}
				});
		}

		return recurse(asyncFunction).then((d: any) => {
			return d;
		});
	}
}
