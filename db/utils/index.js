const fs = require('fs');
const csv = require('fast-csv');

exports.toProper = (string) => {
	let first = string.substring(0, 1);
	let rest = string.slice(1).toLowerCase();
	let proper = `${first.toUpperCase()}${rest}`;

	return proper;
};

exports.parsedEntityJson = (obj, opts) => {
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
	return a;
};

exports.parseCsvService = (path) => {
	if (!fs.existsSync(path)) {
		return [];
	}

	return new Promise(function (resolve, reject) {
		let data = [];
		fs.createReadStream(path)
			.pipe(csv.parse({ headers: true }))
			.on('error', (error) => {
				reject(error);
			})
			.on('data', (row) => data.push(row))
			.on('end', () => {
				resolve(data);
			});
	});
};
