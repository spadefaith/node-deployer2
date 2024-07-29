import { HTTPException } from 'hono/http-exception';
import moment, { type Moment } from 'moment';
import momentTimezone from 'moment-timezone';



export const utcToTimezone = (dt, tz) => {
	return momentTimezone.utc(dt as any).tz(tz);
};
export const handleError = (err) => {
	const message = err.message;

	throw new HTTPException(400, { message });
};

export const getPk = (obj) => {
	// console.log(obj);
	if (obj.constructor.name.toString() == 'Function') {
		const attrs = obj['tableAttributes'];
		obj = Object.keys(attrs).reduce((accu, key) => {
			accu[key] = {
				...attrs[key],
				type: attrs[key]?.type?.constructor?.name
			};
			return accu;
		}, {});
	}
	return Object.keys(obj).reduce((accu, key) => {
		if (obj[key]) {
			let val = obj[key];
			if (val.primaryKey) {
				accu = key;
			}
		}
		return accu;
	}, '');
};

export const parsedEntityJson = (
	obj,
	opts?: {
		filter?: string[];
		type?: string;
	}
) => {
	if (obj.constructor.name.toString() == 'Function') {
		const attrs = obj['tableAttributes'];
		obj = Object.keys(attrs).reduce((accu, key) => {
			accu[key] = {
				...attrs[key],
				type: attrs[key]?.type?.constructor?.name
			};
			return accu;
		}, {});
	}
	const a = {
		type: opts ? opts.type || 'object' : 'object',
		properties: {}
	};
	let cols = [];
	const hasFilter = opts && opts.filter && opts.filter.length;
	if (hasFilter) {
		const hasAll = opts.filter.includes('*');
		const wl = ['pk', 'id', '-pk', '-id'];
		if (opts.filter[0] != '*' && hasAll) {
			throw new Error("'*' must be the first element");
		}
		let pkCol = Object.keys(obj).reduce((accu, key) => {
			if (obj[key]) {
				let val = obj[key];
				if (val.primaryKey) {
					accu = key;
				}
			}
			return accu;
		}, null);

		opts.filter = opts.filter.map((item) => {
			let pref = item.substring(0, 1) == '-';
			let hasPk = wl.includes(item);

			if (hasPk) {
				return pref ? `-${pkCol}` : pkCol;
			}

			return item;
		});

		let removedCols = opts.filter.filter((item) => item.substring(0, 1) == '-');
		let toRemoveCols = removedCols.map((item) => item.substring(1));

		if (hasAll) {
			cols = Object.keys(obj);
		} else {
			cols = opts.filter.filter((item) => !removedCols.includes(item));
		}

		cols = cols.filter((item) => {
			return !toRemoveCols.includes(item);
		});
	} else {
		cols = Object.keys(obj);
	}
	let uniqueCols = [...new Set(cols)];
	uniqueCols.forEach((key) => {
		const { type: fieldType, length, allowNull, defaultValue } = obj[key];
		let zType = 'string';
		if (['TEXT', 'STRING', 'DATE'].includes(fieldType)) {
			zType = 'string';
		} else if (['NUMBER', 'INTEGER'].includes(fieldType)) {
			zType = 'number';
		}

		a.properties[key] = {
			type: zType
		};
		if (length) {
			a.properties[key].maxLength = length;
		}
		if (!allowNull) {
			a.properties[key].required = true;
		} else {
			a.properties[key].optional = true;
		}
		if (defaultValue != undefined && !['DATETIME', 'DATE'].includes(fieldType)) {
			if (typeof defaultValue != 'object') {
				a.properties[key].default = defaultValue;
			}
		}
	});
	// console.log(a);
	return a;
};

export const mergeTo = (value, obj) => {
	if (isFalsy(value)) {
		return {};
	}

	return obj || {};
};

export const toProper = (string) => {
	let first = string.substring(0, 1);
	let rest = string.slice(1).toLowerCase();
	let proper = `${first.toUpperCase()}${rest}`;

	return proper;
};

export const toCapitalize = (string) => {
	return string.split(' ').reduce((accu, iter) => {
		let first = iter.substring(0, 1);
		let rest = iter.slice(1).toLowerCase();
		let proper = `${first.toUpperCase()}${rest}`;

		accu += ` ${proper}`;
		return accu;
	}, '');
};

export const queryParamsToObj = (str) => {
	try {
		const l = `http://localhost:1000?${str}`;
		const url = new URL(l);

		const o = {};
		for (let [key, value] of url.searchParams.entries()) {
			o[key] = value;
		}

		return o;
	} catch (err) {
		return {};
	}
};

export function isFalsy(val, len?) {
	if (!val) {
		return true;
	}
	const isNumber = val.constructor.name == 'Number';
	const isString = val.constructor.name == 'String';

	if (isNumber) {
		return !val;
	} else if (isString) {
		if (len) {
			return val == 'undefined' || val == 'null' || val.length <= len;
		}
		return val == 'undefined' || val == 'null';
	}
	return false;
}

export function modelToJson(model) {
	// console.log(model);
}
