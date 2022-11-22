package org.gm.app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.METHOD_NOT_ALLOWED, reason="Requested method is not allowed.")
public class MethodNotAllowedException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3351806231198750790L;

}
