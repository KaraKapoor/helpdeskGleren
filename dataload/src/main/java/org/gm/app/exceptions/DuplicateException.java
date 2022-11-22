package org.gm.app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.CONFLICT, reason="Record already exists.")
public class DuplicateException extends RuntimeException{

	private static final long serialVersionUID = 7271992345692293895L;

}
