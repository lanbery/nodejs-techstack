const createEnvFile = require('./locale-env-creator')

main()

async function main() {
  try {
    const envResp = await createEnvFile()
    console.log(envResp)
  } catch (err) {
    console.log(err)
  }
}
