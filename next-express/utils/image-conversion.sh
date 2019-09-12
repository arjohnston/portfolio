#/bin/sh
# based on https://gist.github.com/SandroMachado/9ee516bbd36768ca3844876c50cf4618

# checks if required programs are installed locally
if ! type "cwebp" > /dev/null; then
    echo "cwebp does not appear to be installed:"
    echo "brew install webp"
    exit 1
fi

# if ! type "convert" > /dev/null; then
#     echo "convert does not appear to be installed:"
#     echo "brew install ImageMagick"
#     exit 1
# fi

echo "Converting images to .webp..."

for f in $(find . \( -name "*.png" -o -name "*.jpg" \))
  do
  # Check if webp file already exists
    if [ ! -f "${f%.*}.webp" ]; then
      echo "Converting $f"
      cwebp -q 80 $f -o "${f%.*}.webp" &>/dev/null
    fi
done

echo "Done converting to .webp"
# echo ""
# echo "Converting images to .jp2..."
#
# for j in $(find . \( -name "*.png" -o -name "*.jpg" \))
#   do
#   # Check if jp2 file already exists
#     if [ ! -f "${j%.*}.jp2" ]; then
#       echo "Converting $j"
#       convert $j -quality 0 "${j%.*}.jp2" &>/dev/null
#     fi
# done
#
# echo "Done converting to .jp2"
