define ["chai","jquery","backbone"], (chai)->
    {assert} = chai
    # dfd = $.Deferred()
    retFail = (xhr)->
        {code, message} = xhr.responseJSON.error
        assert(false, "#{code}: #{message}")
    return {assert, retFail, chai}
