import { PDFBool, PrivateConstructorError } from 'src/core';
import { toCharCode, typedArrayFor } from 'src/utils';

describe(`PDFBool`, () => {
  it(`cannot be publicly constructed`, () => {
    expect(() => new (PDFBool as any)({}, true)).toThrow(
      new PrivateConstructorError(PDFBool.name),
    );
  });

  it(`can be cloned`, () => {
    expect(PDFBool.True.clone()).toBe(PDFBool.True);
    expect(PDFBool.False.clone()).toBe(PDFBool.False);
  });

  it(`can be converted to a string`, () => {
    expect(String(PDFBool.True)).toBe('true');
    expect(String(PDFBool.False)).toBe('false');
  });

  it(`can provide its size in bytes`, () => {
    expect(PDFBool.True.sizeInBytes()).toBe(4);
    expect(PDFBool.False.sizeInBytes()).toBe(5);
  });

  it(`can be serialized when true`, () => {
    const buffer = new Uint8Array(8).fill(toCharCode(' '));
    PDFBool.True.copyBytesInto(buffer, 3);
    expect(buffer).toEqual(typedArrayFor('   true '));
  });

  it(`can be serialized when false`, () => {
    const buffer = new Uint8Array(9).fill(toCharCode(' '));
    PDFBool.False.copyBytesInto(buffer, 1);
    expect(buffer).toEqual(typedArrayFor(' false   '));
  });
});
