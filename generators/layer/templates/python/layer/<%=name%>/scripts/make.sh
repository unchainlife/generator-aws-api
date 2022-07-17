cd ..
rm -rf ./build
rm -rf ./out
if [ ! -d "venv" ]; then
    python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
python setup.py install
mkdir -p out/python
cp -R venv/lib out/python
deactivate
