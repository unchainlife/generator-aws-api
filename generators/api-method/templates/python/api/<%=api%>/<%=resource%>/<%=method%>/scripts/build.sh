rm -rf ../out
mkdir ../out
cp -R ../*.py ../out
rm -r ../out/*_test.py
source ../venv/bin/activate
pip install --target ../out/  -r requirements.txt
deactivate
