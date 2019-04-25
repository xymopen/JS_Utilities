/**
 * Obtain the return value of an iterator
 * or capture its error
 * 
 * @template T
 * @param {Iterator<T>} it
 * @returns {Promise<T>}
 */
export const promisifyIterator = it => {
	const next = it.next;
	let resolve, reject;

	/** @type {Promise<T>} */
	const promise = new Promise( ( _resolve, _reject ) => {
		resolve = _resolve;
		reject = _reject;
	} );

	it.next = function ( ...args ) {
		/** @type {IteratorResult<T>} */
		let record;

		try {
			record = next.apply( this, args );

			if ( record.done ) {
				resolve( record.value );
			}

			return record;
		} catch ( error ) {
			reject( error );

			throw error;
		}
	};

	return promise;
};