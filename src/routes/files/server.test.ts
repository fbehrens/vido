import {_myCompare} from './+page.server';

test('myCompare', async function () {
    const _a = { file: 'a', isDir: true };
    const b = { file: 'a', isDir: false };
    expect( _myCompare( _a, b)).toBe(-1);
    expect( _myCompare( b, _a)).toBe(1);
});
