import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count == 3 else {
    FileHandle.standardError.write("Usage: swift scripts/cutout-headshot.swift <photo> <subject.png>\n".data(using: .utf8)!)
    exit(1)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

guard let ciImage = CIImage(contentsOf: input, options: [.applyOrientationProperty: true]) else {
    fatalError("could not read image")
}
let handler = VNImageRequestHandler(ciImage: ciImage)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else { fatalError("no subject found") }
print("instances:", result.allInstances.count)
let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
let outImage = CIImage(cvPixelBuffer: buffer)
let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
try ctx.writePNGRepresentation(of: outImage, to: output, format: .RGBA8, colorSpace: cs)
print("wrote", output.path, outImage.extent)
