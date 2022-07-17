function _build() {
    rm -rf ../out
    mkdir ../out
    cp -R ../*.py ../out
    rm -r ../out/*_test.py
    if [ ! -d "../venv" ]; then
        python -m venv ../venv
    fi
    source ../venv/bin/activate
    pip install --target ../out/  -r ../requirements.txt
    deactivate
}

function _clean() {
    echo "Cleaning $(dirname $(pwd))"
    rm -rf ../out
}

command=$1
args=(${@:2})

case $command in
    "build") _build $args ;;
    "clean") _clean $args ;;
    "*") echo "Unhandled command ${command}"
esac
