var on = {
    client: !!(typeof window !== "undefined" && window.document),
    server: !(typeof window !== "undefined" && window.document)
};

module.exports = on;
