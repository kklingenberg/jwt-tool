const jwt = require("jsonwebtoken");
const { program } = require("commander");
const pkg = require("./package.json");

const COMMIT = process.env.COMMIT ?? "local";

const except = (obj, ...props) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !props.includes(k)));

const collectValues = (v, acc) => (acc ?? []).concat([v]);

program.version(`${pkg.version}@${COMMIT}`);

program
  .command("sign <payload> <secret-or-private-key>")
  .description("Returns the JsonWebToken as string.")
  .option("--algorithm <algorithm>", "(default: HS256)")
  .option(
    "--expires-in <expires-in>",
    "expressed in seconds or a string describing a time span vercel/ms."
  )
  .option(
    "--not-before <not-before>",
    "expressed in seconds or a string describing a time span vercel/ms."
  )
  .option("--audience <audience>")
  .option("--issuer <issuer>")
  .option("--jwtid <jwtid>")
  .option("--subject <subject>")
  .option("--no-timestamp")
  .option("--header <header>")
  .option("--keyid <keyid>")
  .action((payload, secretOrPrivateKey, options) => {
    const p = JSON.parse(payload);
    const s = Buffer.from(secretOrPrivateKey, "base64");
    const opts = {
      ...except(options, "timestamp"),
      ...(options.timestamp ? {} : { noTimestamp: true }),
    };
    console.log(jwt.sign(p, s, opts));
  });

program
  .command("verify <token> <secret-or-public-key>")
  .description("Returns the payload decoded if the signature is valid.")
  .option(
    "--algorithms <algorithm>",
    "The names of the allowed algorithms.",
    collectValues
  )
  .option(
    "--audience <audience>",
    "If you want to check audience (aud), provide a value here.",
    collectValues
  )
  .option(
    "--complete",
    "Return an object with the decoded { payload, header, signature } " +
      "instead of only the usual content of the payload."
  )
  .option(
    "--issuer <issuer>",
    "String or array of strings of valid values for the iss field.",
    collectValues
  )
  .option(
    "--jwtid <jwtid>",
    "If you want to check JWT ID (jti), provide a string value here."
  )
  .option(
    "--ignore-expiration",
    "If set, do not validate the expiration of the token."
  )
  .option("--ignore-not-before")
  .option(
    "--subject <subject>",
    "If you want to check subject (sub), provide a value here."
  )
  .option(
    "--clock-tolerance <clock-tolerance>",
    "Number of seconds to tolerate when checking the nbf and exp claims, " +
      "to deal with small clock differences among different servers."
  )
  .option(
    "--max-age <max-age>",
    "The maximum allowed age for tokens to still be valid. It is expressed " +
      "in seconds or a string describing a time span vercel/ms."
  )
  .option(
    "--clock-timestamp <clock-timestamp>",
    "The time in seconds that should be used as the current time for all " +
      "necessary comparisons."
  )
  .option(
    "--nonce <nonce>",
    "If you want to check nonce claim, provide a string value here. It is used " +
      "on Open ID for the ID Tokens."
  )
  .action((token, secretOrPublicKey, options) => {
    const s = Buffer.from(secretOrPublicKey, "base64");
    console.log(JSON.stringify(jwt.verify(token, s, options), null, 2));
  });

program
  .command("decode <token>")
  .description(
    "Returns the decoded payload without verifying if the signature is valid."
  )
  .option(
    "--json",
    'Force JSON.parse on the payload even if the header doesn\'t contain "typ":"JWT".'
  )
  .option("--complete", "Return an object with the decoded payload and header.")
  .action((token, options) => {
    console.log(JSON.stringify(jwt.decode(token, options), null, 2));
  });

program.parse();
