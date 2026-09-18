const path = require('path');
const terser = require('@rollup/plugin-terser');
const del = require('del');
const gulp = require('gulp');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');

const resolvePath = (name) => {
    return path.resolve(__dirname, name);
};
const onwarn = (warning) => {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    console.warn(`(!) ${warning.message}`);
};

const dirBuild = resolvePath('lib');

gulp.task('clean', () => {
    return del([dirBuild], { force: true });
});

const externalDeps = ['react', 'react-dom', 'axios'];

/**
 * rpt2 默认的 include 为 `*.ts+(|x)` / `**\/*.ts+(|x)`，其中 `+(|x)` 是 extglob 语法。
 * picomatch 升级到 2.3.2 后该模式不再匹配任何路径，导致 rpt2 内部 filter 全部返回 false：
 * resolveId 返回空 -> Rollup 报 `Could not resolve "..."`，且 transform 被跳过（产物会残留 TS 语法）。
 * 这里显式替换为普通 glob，绕开 extglob 的匹配行为差异。
 */
const tsPluginOptions = {
    include: ['**/*.ts', '**/*.tsx'],
    exclude: ['**/*.d.ts'],
};

gulp.task('build', async () => {
    const bundle = await rollup.rollup({
        input: resolvePath('./src/index.ts'),
        external: externalDeps,
        plugins: [typescript(tsPluginOptions), terser()],
        onwarn,
    });

    await bundle.write({
        file: `${dirBuild}/index.js`,
        format: 'esm',
    });
});

gulp.task('default', gulp.series('clean', 'build'));
