from flask import current_app

def allowed_file(filename:str) -> bool:
    """
    Return True if thr file's extension is one of the allowed types.
    """

    if '.' not in filename:
        return False
    ext = filename.rsplit('.',1)[1].lower()
    return ext in current_app.config['ALLOWED_EXTENSIONS']