module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es6': true,
		'node': true
	},
	'extends': 'eslint:recommended',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2018
	},
	'rules': {
		'indent': [
			'error',
			4,
			{ 'SwitchCase': 1}
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single',
			{ 'allowTemplateLiterals': true }
		],
		'semi': [
			'error',
			'always'
		],
		'require-atomic-updates': [
			'off'
		]
	}
};