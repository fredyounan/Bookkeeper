if (typeof(BookKeeper) == 'undefined') {
    BookKeeper = {};
    BookKeeper.UI = {};
}

BookKeeper.UI.AjaxForms = function ()
{
    var formClass = 'js-ajax-form';

    /**
     * Delegate event handlers for AjaxForms
     */
    var init = function ()
    {
        // Class contains formClass allowing for namespacing
        $('body').on('submit', "[class*='" + formClass + "']", submitAjaxForm);
    };

    /**
     * Send an ajax request for the submitted form
     * If sucessful then publish the data, else load
     * the contents of the return form into the current
     * form showing the errors.
     *
     * namespace is attached onto the ajax class:
     * .js-ajax-form-namespace
     *
     * $.publish ajax.modal.success.namespace($form, data)
     * $.publish ajax.modal.error.namespace($form, data)
     *
     * @param e
     */
    var submitAjaxForm = function (e)
    {
        e.preventDefault();

        // Get form namespace and method
        var $form = $(this);
        var namespace = _getNamespace($form);
        var namespacedFormSelector = '.' + formClass + '-' + namespace;

        $.ajax({
            type: _getMethod($form),
            url: $form.attr('action'),
            data: $form.serialize(),
            success: function(data) {
                if (data.success)
                {
                    $.publish('ajax.modal.success.' + namespace, [$form, data.payload]);
                } else {
                    $data = $(data);
                    // Fill the form with ajax content
                    $form.html( $data.find(namespacedFormSelector).html() );
                    $.publish('ajax.modal.error.' + namespace, [$form, data.payload]);
                }
            },
            error: function(xhr, textStatus, thrownError) {
                console.log('Ajax Error: ' + xhr.status + ': ' + thrownError);
            }
        });
    };

    /**
     * Searches the class for namespace in format
     * js-ajax-form-myNamespace and returns
     * .myNamespace to append onto publish method
     *
     * @param $form
     * @returns string namespace or ''
     * @private
     */
    var _getNamespace = function ($form)
    {
        var regex = /js-ajax-form-(\w+)/g;
        matches = regex.exec($form.attr('class'));
        return (matches != null && matches[1] != null) ? matches[1] : '';
    };

    /**
     * Find the method on the form generated
     * by Laravel
     *
     * @param $form
     * @returns string
     * @private
     */
    var _getMethod = function ($form)
    {
        $methodInput = $form.find('input[name=_method]');
        return $methodInput.length > 0 ? $methodInput.val() : 'post';
    };

    return {
        init: init
    };
}();

if (typeof(jQuery) != 'undefined') {
    jQuery(function ($) {
        BookKeeper.UI.AjaxForms.init();
    });
}