const { exec, cp, cd, mkdir } = require("shelljs")

const generateModules = require("./modules")

const validModules = ["cjs", "es", "es5", "umd"]

const publishLib = args => {
    const {
        extraFilesCopy,
        ignoreFiles,
        fileFormat = ["js"],
        libFolder = "dist",
        output = ["cjs"],
        dryRun = false,
        packageAccess = "public",
        root = "es",
        srcFolder
    } = args

    if (!libFolder) {
        throw Error("Missing lib folder")
    }

    mkdir("-p", libFolder)

    validModules.forEach(module => {
        if (output.hasOwnProperty(module)) {
            generateModules(module, output[module], {
                libFolder,
                srcFolder,
                ignoreFiles,
                root,
                fileFormat
            })
        }
    })

    cp("package.json", libFolder)
    cp("-R", extraFilesCopy, libFolder)

    if (!dryRun) {
        cd(libFolder)
        exec(`npm publish --access ${packageAccess}`)
    }
}

module.exports = publishLib
