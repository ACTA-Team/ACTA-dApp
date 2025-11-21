fn main(type_hash: Field, expected_hash: Field, valid: Field) -> pub bool {
    let eq = type_hash == expected_hash;
    let ok = valid == 1;
    eq & ok
}