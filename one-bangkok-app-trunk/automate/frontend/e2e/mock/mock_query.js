/**
 *
 * @param {*} identifier
 * @returns SQL statement for removing account and related data (profile, idenitiy etc.) from identifier(email, phone) argument
 */
function getDeleteUserWithIdentifierQueryString(identifier) {
  return `DELETE
    FROM
        public.account
    WHERE
        id IN 
        (
        SELECT
            a.id
        FROM
            public.account a
        INNER JOIN public."identity" i ON
            (i.account_id = a.id)
        WHERE
            i.identifier = '${identifier}'
        );`;
}

module.exports = {
  getDeleteUserWithIdentifierQueryString,
};
