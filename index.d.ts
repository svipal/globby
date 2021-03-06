import {IOptions as NodeGlobOptions} from 'glob';
import {Options as FastGlobOptions} from 'fast-glob';

export type ExpandDirectoriesOption =
	| boolean
	| ReadonlyArray<string>
	| {files: ReadonlyArray<string>; extensions: ReadonlyArray<string>};

export interface GlobbyOptions extends FastGlobOptions {
	/**
	 * If set to `true`, `globby` will automatically glob directories for you. If you define an `Array` it will only glob files that matches the patterns inside the `Array`. You can also define an `Object` with `files` and `extensions` like in the example below.
	 *
	 * Note that if you set this option to `false`, you won't get back matched directories unless you set `onlyFiles: false`.
	 *
	 * @default true
	 *
	 * @example
	 *
	 * import globby from 'globby';
	 *
	 * (async () => {
	 * 	const paths = await globby('images', {
	 * 		expandDirectories: {
	 * 			files: ['cat', 'unicorn', '*.jpg'],
	 * 			extensions: ['png']
	 * 		}
	 * 	});
	 * 	console.log(paths);
	 * 	//=> ['cat.png', 'unicorn.png', 'cow.jpg', 'rainbow.jpg']
	 * })();
	 */
	readonly expandDirectories?: ExpandDirectoriesOption;

	/**
	 * Respect ignore patterns in `.gitignore` files that apply to the globbed files.
	 *
	 * @default false
	 */
	readonly gitignore?: boolean;
}

/**
 * @param patterns - See supported `minimatch` [patterns](https://github.com/isaacs/minimatch#usage).
 * @param options - See the [`fast-glob` options](https://github.com/mrmlnc/fast-glob#options-1) in addition to the ones in this package.
 * @returns A `Promise<Array>` of matching paths.
 */
export default function globby(
	patterns: string | ReadonlyArray<string>,
	options?: GlobbyOptions
): Promise<string[]>;

/**
 * @param patterns - See supported `minimatch` [patterns](https://github.com/isaacs/minimatch#usage).
 * @param options - See the [`fast-glob` options](https://github.com/mrmlnc/fast-glob#options-1) in addition to the ones in this package.
 * @returns An `Array` of matching paths.
 */
export function sync(
	patterns: string | ReadonlyArray<string>,
	options?: GlobbyOptions
): string[];

export interface GlobTask {
	readonly pattern: string;
	readonly options: GlobbyOptions;
}

/**
 * Note that you should avoid running the same tasks multiple times as they contain a file system cache. Instead, run this method each time to ensure file system changes are taken into consideration.
 *
 * @param patterns - See supported `minimatch` [patterns](https://github.com/isaacs/minimatch#usage).
 * @param options - See the [`fast-glob` options](https://github.com/mrmlnc/fast-glob#options-1) in addition to the ones in this package.
 * @returns An `Array<Object>` in the format `{ pattern: string, options: Object }`, which can be passed as arguments to [`fast-glob`](https://github.com/mrmlnc/fast-glob). This is useful for other globbing-related packages.
 */
export function generateGlobTasks(
	patterns: string | ReadonlyArray<string>,
	options?: GlobbyOptions
): GlobTask[];

/**
 * Note that the options affect the results. If `noext: true` is set, then `+(a|b)` will not be considered a magic pattern. If the pattern has a brace expansion, like `a/{b/c,x/y}`, then that is considered magical, unless `nobrace: true` is set.
 *
 * This function is backed by [`node-glob`](https://github.com/isaacs/node-glob#globhasmagicpattern-options).
 *
 * @param patterns - See supported `minimatch` [patterns](https://github.com/isaacs/minimatch#usage).
 * @param options - See the [`node-glob` options](https://github.com/isaacs/node-glob#globhasmagicpattern-options).
 * @returns A boolean of whether there are any special glob characters in the `patterns`.
 */
export function hasMagic(
	patterns: string | ReadonlyArray<string>,
	options?: NodeGlobOptions
): boolean;

export interface GitignoreOptions {
	readonly cwd?: string;
	readonly ignore?: ReadonlyArray<string>;
}

export type FilterFunction = (path: string) => boolean;

export interface Gitignore {
	(options?: GitignoreOptions): Promise<FilterFunction>;

	/**
	 * @returns A filter function indicating whether a given path is ignored via a `.gitignore` file.
	 */
	sync(options?: GitignoreOptions): FilterFunction;
}

/**
 * `.gitignore` files matched by the ignore config are not used for the resulting filter function.
 *
 * @returns A `Promise` for a filter function indicating whether a given path is ignored via a `.gitignore` file.
 *
 * @example
 *
 * import {gitignore} from 'globby';
 *
 * (async () => {
 * 	const isIgnored = await gitignore();
 * 	console.log(isIgnored('some/file'));
 * })();
 */
export const gitignore: Gitignore;
