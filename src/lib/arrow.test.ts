import { describe, test, expect } from 'vitest';
import { dictionaryVector2, toArrow } from './arrow';
import { parseFilme } from './mediathek';
describe('arrow', () => {
    test.skip("dictionaryVector2", () => {
      console.log(dictionaryVector2)
    });
    test('1',async ()=>{
        const f = await parseFilme('static/test/filme181.json')
        expect(f.length).toBe(181)
        toArrow(f)
    })
});