$(document).ready(function () {
    getQuestionsAnswerList();
});
function getQuestionsAnswerList() {
    var dialogLoading = null;
    $.ajax({
        type: 'GET',
        url: config.server_url.get_question_list,
        dataType: 'json',
        beforeSend: function (XHR) {
            dialogLoading = showLoading();
        },
        success: function (data) {
            if (data.result_code == 0) {
                var html = '';
                $.each(data.question_and_answer_list,
                    function(i, n) {
                        var answer = '';
                        if (n.answer_content_list != null && n.answer_content_list.length > 0) {
                            $.each(n.answer_content_list, function(j, m) {
                                answer += '<p class="label-answer">' + m + '</p>';
                            });

                        }
                        html +=
                            '<div class="weui-media-box weui-media-box_text"><h4 class="weui-media-box__title">' + n.question_title + '</h4><p class="weui-media-box__desc">'+answer+'</p></div>';
                    });
                $(".list-QuestionsAnswerList").append(html);
            } else {
                showAlert(data.result_message, function() {
                    getQuestionsAnswerList();
                });
            }
        },
        complete: function (xhr, type) {
            dialogLoading.hide();
        }
    });
}